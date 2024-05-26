const apiFetch = async (url, method, body) => {
    method = method || "GET";
    const opts = { method };
    if (body) {
        opts.headers = {
            "Content-Type": "application/json",
        };
        opts.body = JSON.stringify(body);
    }

    const resp = await fetch(url, opts);
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Error from API: ${resp.statusText}: ${text}`);
    }
    return resp;
};

const initPlaytime = () => {

    const renderTitle = ({ title }) => {
        return `<b>${title}</b>`;
    };
    const renderItem = ({ id, title, done }) => `
        <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
            <input
                class="form-check-input me-2"
                type="checkbox"
                value=""
                ${done ? "checked" : ""}
                onchange="handleTodoChange(event, '${id}')"
            />
            <div style="flex-grow: 1;">
                ${renderTitle({ title })}
            </div>
            <!-- INSERT DELETE BUTTON HERE -->
        </li>
    `;
    const noItems = `
        <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
            <strong>No tasks yet. Try adding one.</strong>
        </li>
    `;

    const refreshList = () => {
        const doRefresh = async () => {
            const list = document.querySelector("#todo-list");

            const resp = await apiFetch("/fivenights");
            const todos = await resp.json();
            list.innerHTML = todos.map(renderItem).join("");

        };

    /*
    const refreshList = () => {
        const doRefresh = async () => {
            const list = document.querySelector("#fivenights");

            const resp = await apiFetch("/fivenights");
            const fiveNights = await resp.json();
            if (fiveNights.length === 0) {
                list.innerHTML = `
                <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
                    <div style="flex-grow: 1;">
                    Nothing to show
                    </div>
                </li>
            `;
            } else {
                list.innerHTML = `
                <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
                    <div style="flex-grow: 1;">
                    ${fiveNights}
                    </div>
                </li>
            `
                
                //fiveNights.map(renderItem).join("");
            }
        };
        */
        doRefresh().catch(err => console.log("Error refreshing list", err));
    };

    const addItem = async () => {
        const input = document.querySelector("#add-input");
        const playTime = input.value;
        if (!playTime) return;

        await apiFetch("/fivenights", "POST", { playTime });

        input.value = "";
        refreshList();
    };


    const form = document.querySelector("#todo-form");
    form.onsubmit = (ev) => {
        ev.preventDefault();
        addItem().catch(err => console.log("Error adding item", err));
    };


    refreshList();
}

initPlaytime();

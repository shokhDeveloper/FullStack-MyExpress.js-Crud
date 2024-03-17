"use strict";
const elFormUpdate = document.querySelector(".js-form");
const id = window.location.href.split("/").pop();
let user;
(async function () {
    user = await request(`/users/${id}`, "GET");
    if (user) {
        handleRenderDefaultVal(user);
    }
})();
function handleAssignmentValue(key, value) {
    let elFormInputOrSelect = elFormUpdate.querySelector(`#${key}`);
    if (elFormInputOrSelect && value) {
        elFormInputOrSelect.value = value;
    }
}
function handleRenderDefaultVal(user) {
    let keys = Object.keys(user);
    let values = Object.values(user);
    values.splice(values.length - 1);
    keys = keys.filter((item) => item !== "userId");
    keys.forEach((key, index) => {
        handleAssignmentValue(key, values[index]);
    });
}
async function handleSubUpdate(evt) {
    evt.preventDefault();
    let updateuser = {};
    const elTarget = evt.target;
    const formData = new FormData(elTarget);
    let keys = Object.keys(user);
    keys.map((key) => {
        var _a;
        if (formData.get(key)) {
            updateuser[key] = updateuser[key] || ((_a = formData.get(key)) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        }
    });
    let req = await request(`/users/${id}`, "PUT", updateuser);
    if (req.statusCode == 200) {
        elFormUpdate.reset();
        window.location.replace("/");
    }
}
elFormUpdate.addEventListener("submit", handleSubUpdate);

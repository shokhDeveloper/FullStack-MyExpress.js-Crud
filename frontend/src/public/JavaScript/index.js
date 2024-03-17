"use strict";
const elForm = document.querySelector(".js-form");
const elUserTemp = document.querySelector(".js-user-temp").content;
const elTableBody = document.querySelector(".js-table-body");
const handleRenderUser = async (arr = []) => {
    console.log(arr);
    let res = [];
    if (!arr.length) {
        res = await request("/users", "GET");
    }
    else {
        res = arr;
    }
    if (res.length) {
        const usersDocFragment = document.createDocumentFragment();
        elTableBody.innerHTML = '';
        res.forEach((user, index) => {
            const clone = elUserTemp.cloneNode(true);
            clone.querySelector(".js-number").textContent = `${index + 1}`;
            clone.querySelector(".js-name").textContent =
                user.firstName;
            clone.querySelector(".js-age").textContent =
                user.age;
            clone.querySelector(".js-gender").textContent =
                user.gender;
            clone.querySelector(".js-delete").dataset.id = user.userId;
            clone.querySelector(".js-update").dataset.id = user.userId;
            usersDocFragment.append(clone);
        });
        elTableBody.append(usersDocFragment);
    }
};
const handleSub = async (evt) => {
    evt.preventDefault();
    let formData = new FormData(evt.target);
    let user = {
        firstName: formData.get("firstName"),
        age: formData.get("age"),
        gender: formData.get("gender")
    };
    let type = Object.values(user).every(item => !!item);
    if (type) {
        let result = await request("/users", "POST", user);
        if (result.statusCode == 201) {
            handleRenderUser(result);
            elForm.reset();
        }
    }
    else {
        alert("Required fields value");
    }
};
const handleClick = async (evt) => {
    let elTarget = evt.target;
    const id = elTarget.dataset.id;
    if (elTarget.matches(".js-delete")) {
        if (id) {
            await request(`/users/${id}`, "DELETE");
            handleRenderUser();
        }
    }
    if (elTarget.classList.contains("js-update")) {
        if (id) {
            console.log("ishladi");
            window.location.replace(`/users/${id}`);
        }
    }
    else if (elTarget.classList.contains("js-form-filter")) {
        if (elTarget.id !== "all") {
            let result = await request(`/users?gender=${elTarget.id}`, "GET");
            if (result.length) {
                handleRenderUser(result);
            }
            else {
                elTableBody.innerHTML = '';
            }
        }
        else {
            handleRenderUser();
        }
    }
};
window.addEventListener("click", handleClick);
elForm.addEventListener("submit", handleSub);
handleRenderUser();

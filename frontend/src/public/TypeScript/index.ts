const elForm = document.querySelector(".js-form") as HTMLFormElement;
const elUserTemp = (
  document.querySelector(".js-user-temp") as HTMLTemplateElement
).content;
const elTableBody = document.querySelector(
  ".js-table-body"
) as HTMLTableElement;

const handleRenderUser = async (arr: UserType[] = []): Promise<void> => {
  console.log(arr)
  let res:UserType[] = []
  if(!arr.length){
    res = await request("/users", "GET");
  }else{
    res = arr
  }
  if (res.length) {
    const usersDocFragment = document.createDocumentFragment();
    elTableBody.innerHTML = '';
    res.forEach((user: UserType, index: number) => {
      const clone = elUserTemp.cloneNode(true) as DocumentFragment;
      (clone.querySelector(".js-number") as HTMLElement).textContent = `${
        index + 1
      }`;
      (clone.querySelector(".js-name") as HTMLElement).textContent =
        user.firstName;
      (clone.querySelector(".js-age") as HTMLElement).textContent =
        user.age as string;
      (clone.querySelector(".js-gender") as HTMLElement).textContent =
        user.gender;
       ( clone.querySelector(".js-delete") as HTMLButtonElement ).dataset.id = user.userId as string;
       ( clone.querySelector(".js-update") as HTMLButtonElement ).dataset.id = user.userId as string;
      usersDocFragment.append(clone);
    });
    elTableBody.append(usersDocFragment);
  }
};
const handleSub = async (evt: SubmitEvent): Promise<void> => {
  evt.preventDefault();
  let formData = new FormData(evt.target as HTMLFormElement)
  let user:UserType = {
    firstName: formData.get("firstName") as string,
    age: formData.get("age") as string,
    gender: formData.get("gender") as string
  }  
  let type = Object.values(user).every(item => !!item)
  if(type){
    let result = await request("/users", "POST", user)
    if(result.statusCode == 201){
      handleRenderUser(result)
      elForm.reset();
    }
}else{
    alert("Required fields value")
  }
};
const handleClick = async (evt:Event):Promise<void> => {
    let elTarget = (evt.target as HTMLButtonElement)
    const id = elTarget.dataset.id
    if(elTarget.matches(".js-delete")){
        if(id){
            await request(`/users/${id}`, "DELETE")
            handleRenderUser()
        }
    }
    if(elTarget.classList.contains("js-update")){
      if(id){
        console.log("ishladi")
        window.location.replace(`/users/${id}`)
      }
    }else if(elTarget.classList.contains("js-form-filter")){
      if(elTarget.id !== "all"){
        let result = await request(`/users?gender=${elTarget.id}`, "GET")
        if(result.length){
          handleRenderUser(result)
        }else{
          elTableBody.innerHTML = ''
        }
      }else{
        handleRenderUser()
      }
    }
}
window.addEventListener("click", handleClick)
elForm.addEventListener("submit", handleSub);
handleRenderUser();

const elFormUpdate = document.querySelector(".js-form") as HTMLFormElement;
const id: string = window.location.href.split("/").pop() as string;
let user: UserType | any;
(async function () {
  user = await request(`/users/${id}`, "GET");
  if (user) {
    handleRenderDefaultVal(user);
  }
})();

function handleAssignmentValue(key: string, value: string | number): void {
  let elFormInputOrSelect: elGeneric<HTMLInputElement, HTMLSelectElement> =
    elFormUpdate.querySelector(`#${key}`);
  if (elFormInputOrSelect && value) {
    elFormInputOrSelect.value = value as string;
  }
}

function handleRenderDefaultVal(user: UserType): void {
  let keys: string[] = Object.keys(user);
  let values: (string | number)[] = Object.values(user);
  values.splice(values.length - 1);
  keys = keys.filter((item) => item !== "userId");
  keys.forEach((key: string, index) => {
    handleAssignmentValue(key, values[index]);
  });
}

async function handleSubUpdate(evt: SubmitEvent): Promise<void> {
  evt.preventDefault();
  let updateuser:Record<string, number | string> = {};
  const elTarget = evt.target as HTMLFormElement;
  const formData = new FormData(elTarget);
  let keys = Object.keys(user);
  keys.map((key: string) => {
    if (formData.get(key)) {
      updateuser[key] = updateuser[key] || formData.get(key)?.toString() || ''
    }
  });
  let req = await request(`/users/${id}`, "PUT", updateuser)
  if(req.statusCode == 200){
    elFormUpdate.reset();
    window.location.replace("/")
  }
}

elFormUpdate.addEventListener("submit", handleSubUpdate);

const cl= console.log;
const postContainer =document.getElementById("postContainer")
const postForm = document.getElementById("postForm")
const titlecontrol = document.getElementById("title")
const bodycontrol =document.getElementById("body")
const userIdcontrol =document.getElementById("userId") 
const submitBtn = document.getElementById("submitBtn")
const UpdateBtn =document.getElementById("UpdateBtn")
const spiner = document.getElementById("spiner")
const snkbar= (masg,icon)=>{
    swal.fire({
        title:masg,
        icon:icon,
        timer:2000
    })
}

const Base_url="https://jsonplaceholder.typicode.com";
const Post_url =`${Base_url}/posts`;

const fatchdata= ()=>{
  spiner.classList.remove("d-none")
    let xhr = new XMLHttpRequest()
    xhr.open("GET",Post_url,true)
    xhr.send(null)

    xhr.onload =()=>{
          spiner.classList.add("d-none")
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)

            templating(data)
            snkbar("Posts Fatched Successfuly ","success")
        }else{
            snkbar("Cant Fatch Data","error")
        }
    }

    xhr.onerror =()=>{
        snkbar("network Error","error")
          spiner.classList.add("d-none")
    }
    
}
fatchdata()
const templating =(d)=>{
    let result ="";

    d.forEach(post => {
        result +=` <div class="col-md-4 mb-5">
                <div class="card h-100" id="${post.id}">
                    <div class="card-header">
                        <h2>${post.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="onEdit(this)"  class="btn btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
                    </div>
                </div>
            </div>`
    });
    postContainer.innerHTML= result;

}

const onPostAdd =(eve)=>{
    spiner.classList.remove("d-none")
    eve.preventDefault();

    let Post_obj = {
        title:titlecontrol.value,
        body:bodycontrol.value,
        userid:userIdcontrol.value
    }

    let xhr =new XMLHttpRequest()
    xhr.open("POST",Post_url,true)
    xhr.setRequestHeader("content-type","application/json")
    xhr.setRequestHeader("Auth","Jwt Token")
    xhr.send(JSON.stringify(Post_obj))

    xhr.onload =()=>{
         spiner.classList.add("d-none")
      if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)

            let card= document.createElement("div")
            card.classList= "col-md-4 mb-5"
            card.innerHTML= `
             <div class="card h-100" id="${data.id}">
                    <div class="card-header">
                        <h2>${Post_obj.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${Post_obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button  onclick="onEdit(this)"  class="btn btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>
                    </div>
                </div>`

                postForm.reset()

                postContainer.prepend(card)
        }

    }

    xhr.onerror= ()=>{
        snkbar("network error","error")
         spiner.classList.add("d-none")
    }
}

const onEdit=(ele)=>{
    spiner.classList.remove("d-none")
    let Edit_id = ele.closest(".card").id
    localStorage.setItem("Edit_id",Edit_id)

    let Edit_url =`${Base_url}/posts/${Edit_id}`

    let xhr =new XMLHttpRequest()
    xhr.open("GET",Edit_url,true)
    xhr.send(null)

    xhr.onload= ()=>{
        spiner.classList.add("d-none")
        if(xhr.status >= 200 && xhr.status <= 299){
            let res= JSON.parse(xhr.response)

            titlecontrol.value = res.title;
            bodycontrol.value = res.body;
            userIdcontrol.value =res.id;

            submitBtn.classList.add("d-none")
            UpdateBtn.classList.remove("d-none")
        }
    }
     xhr.onerror= ()=>{
        snkbar("network error","error")
         spiner.classList.add("d-none")
    }
}

const onUpdatepost = (ele)=>{
      spiner.classList.remove("d-none")
    let Update_id = localStorage.getItem("Edit_id")
    cl(Update_id)
    let Update_url =`${Base_url}/posts/${Update_id}`;
    cl(Update_url)
    let Update_obj ={
      title:titlecontrol.value,
        body:bodycontrol.value,
        userid:userIdcontrol.value,
        id:Update_id
    }
    let xhr = new XMLHttpRequest()
     xhr.open("PATCH",Update_url,true)
    xhr.setRequestHeader("content-type","application/json")  
      xhr.setRequestHeader("Auth","Jwt Token")   
     xhr.send(JSON.stringify(Update_obj))

      xhr.onload =()=>{
          spiner.classList.add("d-none")
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            let col =document.getElementById(Update_id).children
            col[0].innerHTML = `<h2>${res.title}</h2>`
            col[1].innerHTML =`<p>${res.body}</p>`

            submitBtn.classList.remove("d-none")
            UpdateBtn.classList.add("d-none")
            postForm.reset()
            snkbar("Post is Updated","success")
        }else{
            snkbar("something went worng while Updating","error")
        }
      }

      xhr.onerror=()=>{
        snkbar("network Error")
        spiner.classList.add("d-none")
      }

}

const onRemove= (ele)=>{
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be Remove  this post !!!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    spiner.classList.remove("d-none")
    let Remove_id = ele.closest(".card").id
    let Remove_url = `${Base_url}/posts/${Remove_id}`
    cl(Remove_url)
    let xhr =new XMLHttpRequest()
    xhr.open("DELETE",Remove_url,true)
    xhr.send(null)

    xhr.onload =()=>{
        spiner.classList.add("d-none")
        if(xhr.status >= 200 && xhr.status <= 299){
            ele.closest(".col-md-4").remove()
        }
    }
     xhr.onerror=()=>{
        snkbar("network Error")
        spiner.classList.add("d-none")
      }

    Swal.fire({
      title: "Deleted!",
      text: "Your post has been deleted.",
      icon: "success"
    });
  }
});
}
postForm.addEventListener("submit",onPostAdd)
UpdateBtn.addEventListener("click",onUpdatepost)




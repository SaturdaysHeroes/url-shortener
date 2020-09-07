const button = document.getElementById("post-btn");
const websiteInput = document.getElementById("websiteURL")

function validateURL(url) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    var regexp = new RegExp(expression);

    return regexp.test(url);
}

websiteInput.addEventListener("input", async _ => {
    let URL = websiteInput.value;
    
    if (!validateURL(URL) || (!URL.startsWith("https://") && !URL.startsWith("http://"))) {
        websiteInput.classList.add("error");
    } else {
        websiteInput.classList.remove("error");
    }
})

button.addEventListener("click", async _ => {
    let URL = document.getElementById("websiteURL").value;
    let Slug = document.getElementById("slug").value;

    if (!validateURL(URL) || (!URL.startsWith("https://") && !URL.startsWith("http://"))) {
        swal("Invalid URL", "Please provide a valid URL and try again!", "error")
    } else {
        axios({
            method: "post",
            url: "http://localhost:5000/create",
            headers: {
                Authorization: "PASSWORD"
            },
            data: {
                url: URL,
                slug: Slug
            }
        })
        .then(res => {
            if (res.status == 200) {
                swal("Success!", "http://localhost:5000/" + res.data, "success");
            };
        })
        .catch(err => {
            if (err.response.status == 409) {
                swal("Error", "The provided slug is already in use!", "error");
                return
            };

            if (err.response.status == 500) {
                swal("Error", "An internal server error occurred!", "error");
                return
            }; 

            swal("Error", "An error has occurred!", "error");
        });
    };
});
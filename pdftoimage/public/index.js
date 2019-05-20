(async () => {
    const pdfjs = require("./module/pdf");
    const axios = require("axios");

    const PDFJs = new pdfjs();

    // pdf 먼저 서버에 업로드 해야 함!
    // const sample =
    //     "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
    const sample = "http://localhost:3002/assets/sample.pdf";

    try {
        let result = await PDFJs.pdfToBlob(sample);

        result.data.forEach(pdf => {
            const formData = new FormData();
            formData.append("pdf", pdf);
            // formData.set('image', 'image');

            axios({
                method: "post",
                url: "/upload/pdf/userId",
                data: formData,
                config: { headers: { "Content-Type": "multipart/form-data" } }
            })
                .then(function(response) {
                    //handle success
                    console.log(response.data.filepath);
                    const img = document.createElement("img");
                    img.src = response.data.filepath;
                    const target = document.getElementById("image-field");
                    const total = document.getElementById("total");
                    target.appendChild(img);
                    total.innerHTML = target.childElementCount;
                    console.log(target.childElementCount);
                })
                .catch(function(response) {
                    //handle error
                    console.log(response);
                });
        });
    } catch (err) {
        console.error(err);
    }
})();

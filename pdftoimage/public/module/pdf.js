const pdfLib = require("pdfjs-dist");

class PdfJS {
    constructor() {
        pdfLib.GlobalWorkerOptions.workerSrc =
            "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js";

        this.scale = 1.4;
    }

    pdfToBlob(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const pdf = await pdfLib.getDocument(file);

                const pages = pdf.numPages;

                let idx = 1;
                const chunks = [];

                for (; idx <= pages; idx++) {
                    const page = await pdf.getPage(idx);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const viewport = page.getViewport(this.scale);

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: ctx,
                        viewport
                    };
                    const renderTask = page.render(renderContext);

                    renderTask.promise.then(() => {
                        canvas.toBlob(blob => {
                            chunks.push(blob);

                            if (chunks.length === pages) {
                                resolve({
                                    data: chunks,
                                    pageNum: pages
                                });
                            }
                        }, "image/jpeg");
                    });
                }
            } catch (err) {
                reject(err);
            }
        });

        // pdf.getPage(index).then(function(page) {

        //     let canvas = document.createElement('canvas');
        //     let canvasContext = canvas.getContext('2d');
        //     let viewport = page.getViewport(scale);
        //     canvas.height = viewport.height;
        //     canvas.width = viewport.width;

        //     let renderTask = page.render({canvasContext, viewport});

        //     renderTask.promise.then(function() {
        //         canvas.toBlob(function(blob) {
        //             callback(null, blob, pages)
        //         }, 'image/jpeg');
        //     });
        // });
        // }
    }
}

module.exports = PdfJS;

// const pdfLib = require('pdfjs-dist')
// const assert = require('assert')
// const fs = require('fs')
// const { createCanvas } = require('canvas')
// function NodeCanvasFactory() { }
// NodeCanvasFactory.prototype = {
//     create: function NodeCanvasFactory_create(width, height) {
//         assert(width > 0 && height > 0, 'Invalid canvas size');
//         var canvas = createCanvas(width, height);
//         var context = canvas.getContext('2d');
//         return {
//             canvas: canvas,
//             context: context,
//         };
//     },

//     reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
//         assert(canvasAndContext.canvas, 'Canvas is not specified');
//         assert(width > 0 && height > 0, 'Invalid canvas size');
//         canvasAndContext.canvas.width = width;
//         canvasAndContext.canvas.height = height;
//     },

//     destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
//         assert(canvasAndContext.canvas, 'Canvas is not specified');

//         // Zeroing the width and height cause Firefox to release graphics
//         // resources immediately, which can greatly reduce memory consumption.
//         canvasAndContext.canvas.width = 0;
//         canvasAndContext.canvas.height = 0;
//         canvasAndContext.canvas = null;
//         canvasAndContext.context = null;
//     },
// };
// class PdfJS {

//     constructor() {

//         pdfLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';

//         this.scale = 1.2

//     }

//     pdfToBlob(file) {

//         return new Promise(async (resolve, reject) => {

//             try {
//                 file = './assets/sample.pdf'
//                 const pdf = await pdfLib.getDocument(file)

//                 const pages = pdf.numPages;
//                 console.log('pages', pages)
//                 let idx = 1;

//                 for (; idx < pages; idx++) {
//                     console.log(idx)
//                     const page = await pdf.getPage(idx)
//                     console.log('page', page)
//                     // const canvas = document.createElement('canvas')
//                     // const ctx = canvas.getContext('2d')
//                     const viewport = page.getViewport(this.scale)
//                     var canvas = createCanvas(viewport.width, viewport.height);
//                     var context = canvas.getContext('2d');

//                     // canvas.height = viewport.height
//                     // canvas.width = viewport.width

//                     const renderContext = {
//                         canvasContext: context,
//                         viewport,
//                         canvasFactory: new NodeCanvasFactory()
//                     }

//                     await page.render(renderContext);
//                     // const renderTask = page.render(renderContext);

//                     var image = canvas.toBuffer()
//                     fs.writeFileSync(`./uploads/zzz${Date.now()}.png`, image)
//                     console.log('???')
//                     // if ()
//                 }

//             } catch (err) {
//                 console.error(err)
//                 reject(err)
//             }
//         })
//     }

// pdf.getPage(index).then(function(page) {

//     let canvas = document.createElement('canvas');
//     let canvasContext = canvas.getContext('2d');
//     let viewport = page.getViewport(scale);
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;

//     let renderTask = page.render({canvasContext, viewport});

//     renderTask.promise.then(function() {
//         canvas.toBlob(function(blob) {
//             callback(null, blob, pages)
//         }, 'image/jpeg');
//     });
// });
// }
// }

// module.exports = PdfJS

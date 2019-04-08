import React, { Component } from 'react'
import * as PDFjs from 'pdfjs-dist'

const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

export default class PDFViewer extends Component {

    componentDidMount() {
        PDFjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';
        PDFjs.getDocument(PDF_URL).then((pdf) => {
            console.log(pdf);
            this.setState({ pdf });
        });
    }


    render() {
        return (
            <div>
                heloow
            </div>
        )
    }
}
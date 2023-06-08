import wallpaper from "./images/wallpaper.jpg"
import samplePdf from "./pdfs/sample.pdf?path=123"

const domHandler = () => {
    console.log(wallpaper);
    console.log(samplePdf);
    document.body.style.backgroundImage = `url(${wallpaper})`
    const link = document.createElement('a')
    link.href = samplePdf + '#page=2'
    link.textContent = "Sample PDF"
    document.body.appendChild(link)
}

export default domHandler
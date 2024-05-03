import { PublisherInterface } from "@chili-publish/publisher-interface"
import { ChiliConnector } from "@seancrowe/chiliconnector-v1_2"

async function loadPublisher(editorUrl: string, baseUrl: string, docId: string, apiKey: string): Promise<void> {
  const app = document.getElementById("app") || document.createElement("div");
  app.id = "app";
  app.innerHTML = `
        <div style="text-align: center; margin-top: 20px;">
            PDF Export Settings ID:<input id="pdfExportSettings" title="PDF Export Settings">
            Image Conversion ID:<input id="imageConversionProfileId" title="Image Conversion Profile ID">
            <button id="save">Save</button>
            <button id="export">Export</button>
            <button id="exportHard">Export with Hardcoded PDF Setting</button>
            <div id="chili-editor"></div>
        </div>
    `;
  document.body.appendChild(app);
  const div = document.getElementById("chili-editor") as HTMLElement;
  const pi = await PublisherInterface.buildOnElement(div, editorUrl, {});

  // @ts-ignore
  pi.iframe.style.width = "100%"
  // @ts-ignore
  pi.iframe.style.height = "800px"

  // @ts-ignore
  window.publisher = pi;

  const cc = new ChiliConnector(baseUrl);
  cc.apiKey = apiKey;

  document.getElementById("save")?.addEventListener("click", async (e) => {
    const xml = await pi.executeFunction("document", "GetTempXML") as string;

    const resp = await cc.api.resourceItemSave({ resourceName: "Documents", xml, itemID: docId });

    if (resp.ok) {
      alert("Saved");
    }
    else {
      alert("Save failed");
    }
    console.log(await resp.text())
  });

  document.getElementById("export")?.addEventListener("click", async (e) => {
    const pdfId = (document.getElementById("pdfExportSettings") as HTMLInputElement).value;
    const imageId = (document.getElementById("imageConversionProfileId") as HTMLInputElement).value;

    generateImage({ docId, imageId, pdfId });
  })

  document.getElementById("exportHard")?.addEventListener("click", async (e) => {
    const imageId = (document.getElementById("imageConversionProfileId") as HTMLInputElement).value;
    const pdfXml = "<item name=\"High Resolution\" id=\"0305fc89-1956-45e5-8377-b0bc82fcc56f\" relativePath=\"\" pdfEngine=\"1\" missingAdPlaceHolderColor=\"#FF00FF\" missingAdPlaceHolder=\"False\" missingEditPlaceHolder=\"False\" includeLinks=\"False\" includeGuides=\"False\" includeTextRangeBorder=\"True\" includePageMargins=\"True\" includeFrameBorder=\"True\" imageQuality=\"original\" includeCropMarks=\"True\" includeBleedMarks=\"False\" includeImages=\"True\" convertColors=\"False\" colorProfile=\"\" embedProfile=\"False\" includeNonPrintingLayers=\"False\" includeGrid=\"True\" includeBleed=\"False\" includeAdOverlays=\"False\" includeSectionBreaks=\"False\" includePageLabels=\"False\" includeFrameInset=\"True\" includeBaseLineGrid=\"True\" includeSlug=\"False\" includeAnnotations=\"False\" outputSplitPages=\"1\" layoutID=\"\" createAllPages=\"True\" pageRangeStart=\"1\" userPassword=\"\" ownerPassword=\"\" pdfSubject=\"\" pdfKeywords=\"\" watermarkText=\"\" pdfLayers=\"False\" createSingleFile=\"True\" createSpreads=\"False\" serverOutputLocation=\"\" pdfNamePattern=\"\" slugLeft=\"\" slugTop=\"\" slugRight=\"\" slugBottom=\"\" bleedRight=\"3 mm\" bleedTop=\"3 mm\" bleedLeft=\"3 mm\" useDocumentBleed=\"True\" useDocumentSlug=\"True\" optimizationOptions=\"\" preflight_overrideDocumentSettings=\"False\" preflight_minOutputResolution=\"72\" preflight_minResizePercentage=\"70\" preflight_maxResizePercentage=\"120\" dataSourceIncludeBackgroundLayers=\"False\" dataSourceCreateBackgroundPDF=\"False\" dataSourceRowsPerPDF=\"100\" dataSourceMaxRows=\"-1\" dontDeleteExistingDirectory=\"False\" collateOutputWidth=\"210mm\" collateNumRows=\"10\" collateNumCols=\"2\" collateOutputHeight=\"297mm\" collateColumnWidth=\"90 mm\" collateStartX=\"10mm\" collateStartY=\"10mm\" collateMarginX=\"10mm\" allowExtractContent=\"True\" collateMarginY=\"10mm\" collateOutput=\"False\" collateDrawPageBorder=\"False\" collateIncludeFileHeader=\"False\" missingAdSizePlaceHolderColor=\"#FF00FF\" rgbSwatches=\"False\" dropshadowQuality=\"300\" missingEditPlaceHolderColor=\"#FF00FF\" annotationBorderColor=\"#FF0000\" annotationFillColor=\"#FFFFFF\" annotationOpacity=\"50\" linkBorderColor=\"#0000FF\" dropshadowTextQuality=\"300\" bleedBottom=\"3 mm\" barWidthReduction=\"0 mm\" markOffset=\"2.5 mm\" markWidth=\"0.15 mm\" dataSourceEngine=\"server_code\" dataSourceNumConcurrent=\"3\" dataSourceUnspecifiedContentType=\"variable_data\" dataSourceIncludeGenerationLog=\"False\" dataSourceUnspecifiedPageContentType=\"variable_data\" outputIntentRegistryName=\"http:\/\/www.color.org\" outputIntentConditionIdentifier=\"FOGRA39\" outputIntent=\"CoatedFOGRA39.icc\" pdfStandard=\"PDF\/X-4\" pdfVersion=\"4\" debugVtContent=\"False\" watermarkType=\"none\" watermarkPdfAssetID=\"\" watermarkPdfAnchor=\"top_left\" pageRangeEnd=\"999999\" watermarkPdfSize=\"original\" convertBlacks=\"False\" convertAnyK100=\"True\" convertSystemBlack=\"True\" convert0_0_0_100=\"True\" convertBlackToC=\"63\" convertBlackToK=\"100\" convertBlackToY=\"51\" convertBlackToM=\"52\" debugDropShadowsWithoutBlur=\"False\" missingAdSizePlaceHolder=\"False\" pdfCreator=\"CreationHub - Publisher\" pdfAuthor=\"CreationHub\" allowPrinting=\"True\" allowModifyDocument=\"True\" fastWebView=\"False\" embedFonts=\"True\" useFontSubset=\"True\" exportDatasourceXlsx=\"False\" exportDatasourceCsv=\"False\" pdfTitle=\"{0}\" dataSourceCreate=\"True\" includeBookmarks=\"False\" maxRecordsPerDatasourceFile=\"50000\" minSuccessRate=\"100\" errorHandling=\"error\" removeInvisibleImageData=\"False\" forPreview=\"False\"><pdfvt_metaDataConfigItems \/><color_images_settings downsampling=\"Off\" targetResolution=\"0\" resolutionThreshold=\"0\" compression=\"RetainExisting\" compressionQuality=\"\" \/><grayscale_images_settings downsampling=\"Off\" targetResolution=\"0\" resolutionThreshold=\"0\" compression=\"RetainExisting\" compressionQuality=\"\" \/><monochrome_images_settings downsampling=\"Off\" targetResolution=\"0\" resolutionThreshold=\"0\" compression=\"RetainExisting\" compressionQuality=\"\" \/><\/item>";

    generateImage({ pdfXml, imageId, docId })
  })

  async function generateImage({ pdfId, imageId, pdfXml, docId }: { pdfId?: string, imageId: string, docId: string, pdfXml?: string }) {

    if (pdfId != null) {
      const pdfXmlResp = await cc.api.resourceItemGetXML({ itemID: pdfId, resourceName: "PdfExportSettings" });
      if (!pdfXmlResp.ok) {
        alert("PDF Export settings wrong")
        return;
      }
      pdfXml = await pdfXmlResp.text();
    }
    const taskXmlResp = await cc.api.documentCreateImages({ itemID: docId, settingsXML: pdfXml as string, imageConversionProfileID: imageId })
    const taskJson = await taskXmlResp.json();
    let currentTask = taskJson;

    while (currentTask.finished == "False") {
      currentTask = await cc.api.taskGetStatus({ taskID: currentTask.id });
    }

    console.log(currentTask);
    alert("task done - see console");
  }

}


document.addEventListener("DOMContentLoaded", () => {
  const app = document.createElement("div");
  app.innerHTML = `
        <div style="text-align: center; margin-top: 20px;">
            <h1 id="header">Give me a document URL</h1>
            <input type="text" id="documentUrl" placeholder="Enter URL here">
            <button id="addDocument">Add Document</button>
        </div>
    `;
  document.body.appendChild(app);

  const button = document.getElementById("addDocument")!;
  button.addEventListener("click", async () => {
    const input = document.getElementById("documentUrl") as HTMLInputElement;
    const success = await loadChili(input.value);
    if (success) {
      app.innerHTML = ''; // Clears the UI if successful
    }
  });
});

async function loadChili(url: string): Promise<boolean> {
  if (!url.includes("editor_html.aspx")) {
    alert("wrong URL");
    return false;
  }

  const urlObject = new URL(url);
  const doc = urlObject.searchParams.get("doc");
  const apiKey = urlObject.searchParams.get("apiKey");
  if (!doc || !apiKey) {
    alert("Missing parameters");
    return false;
  }

  const baseUrl = `${urlObject.protocol}//${urlObject.hostname}`;
  loadPublisher(url, baseUrl, doc, apiKey);
  return true;
}



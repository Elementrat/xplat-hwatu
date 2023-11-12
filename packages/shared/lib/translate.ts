import createClient, {
  TextTranslationClient,
  TranslateQueryParamProperties
} from "@azure-rest/ai-translation-text";
import {
  TranslatorCredential,
  TranslatedTextItemOutput,
  ErrorResponseOutput
} from "@azure-rest/ai-translation-text";

const translateCedential: TranslatorCredential = {
  key: "85b9501d87ce4de3a2315e6359ad52e7",
  region: "westus2"
};

let translationClient: TextTranslationClient;

const translate = async (
  text: string,
  queryParameters: TranslateQueryParamProperties & Record<string, unknown>
) => {
  if (!translationClient) {
    translationClient = await createClient(
      "https://api.cognitive.microsofttranslator.com/",
      translateCedential
    );
  }

  const translateResponse = await translationClient.path("/translate").post({
    body: [{ text }],
    queryParameters
  });

  if (translateResponse?.body) {
    const translationResponse = translateResponse?.body as
      | TranslatedTextItemOutput[]
      | ErrorResponseOutput;

    if ("length" in translationResponse) {
      const result = translationResponse[0].translations[0];
      return result;
    } else {
      console.log("ERROR", translationResponse);
    }
  }
};

export { translate };

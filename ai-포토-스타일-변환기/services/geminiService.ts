import { GoogleGenAI, Modality } from "@google/genai";

export async function generateStyledImage(
  base64Image: string,
  mimeType: string,
  prompt: string,
  apiKey: string
): Promise<{ base64: string; mimeType: string; }> {
  if (!apiKey) {
      throw new Error("API 키가 제공되지 않았습니다.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [{
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      }],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.promptFeedback?.blockReason) {
      throw new Error(`요청이 안전 설정에 의해 차단되었습니다: ${response.promptFeedback.blockReason}`);
    }

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data && part.inlineData.mimeType) {
        return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
        };
      }
    }

    const responseText = response.candidates?.[0]?.content?.parts
        ?.filter(p => p.text)
        ?.map(p => p.text)
        ?.join('\n');

    if (responseText) {
        throw new Error(`API가 이미지를 반환하지 않았습니다. 대신 다음 텍스트를 반환했습니다: "${responseText}"`);
    }

    throw new Error("API가 유효한 이미지를 반환하지 않았습니다. 응답을 확인해주세요.");
  } catch (error) {
    console.error("Error generating styled image:", error);
    if (error instanceof Error) {
        if (/API key not valid/i.test(error.message)) {
             throw new Error("API 키가 유효하지 않습니다. 확인 후 다시 시도해주세요.");
        }
        throw new Error(`이미지 변환에 실패했습니다. (오류: ${error.message})`);
    }
    throw new Error("이미지 변환에 실패했습니다. 알 수 없는 오류가 발생했습니다.");
  }
}
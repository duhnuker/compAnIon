var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let sentimentPipeline = null;
export function analyseSentiment(text) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sentimentPipeline) {
            const { pipeline } = yield import('@xenova/transformers');
            sentimentPipeline = yield pipeline('sentiment-analysis');
        }
        const result = yield sentimentPipeline(text, {
            revision: 'default',
            quantized: true
        });
        const { label, score } = result[0];
        return { label, score };
    });
}

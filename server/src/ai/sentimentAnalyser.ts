import { pipeline } from '@xenova/transformers';

let sentimentPipeline: any = null;

export async function analyseSentiment(text: string): Promise<{ label: string; score: number }> {
  if (!sentimentPipeline) {
    sentimentPipeline = await pipeline('sentiment-analysis');
  }
  
  const result = await sentimentPipeline(text);
  return result[0];
}

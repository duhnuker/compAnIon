let sentimentPipeline: any = null;

export async function analyseSentiment(text: string): Promise<{ label: string; score: number }> {
  if (!sentimentPipeline) {
    const { pipeline } = await import('@xenova/transformers');
    sentimentPipeline = await pipeline('sentiment-analysis');
  }
  
  const result = await sentimentPipeline(text);
  return result[0];
}

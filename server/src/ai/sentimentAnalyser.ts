let sentimentPipeline: any = null;

export async function analyseSentiment(text: string): Promise<{ label: string; score: number }> {
  if (!sentimentPipeline) {
    const { pipeline } = await import('@xenova/transformers');
    sentimentPipeline = await pipeline('sentiment-analysis');
  }
  
  const result = await sentimentPipeline(text);
  const { label, score } = result[0];

  const adjustedScore = 100 - ((1 - score) * 100000);
  
  return { label, score: adjustedScore};
}

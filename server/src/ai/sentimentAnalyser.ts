let sentimentPipeline: any = null;

export async function analyseSentiment(text: string): Promise<{ label: string; score: number }> {
  if (!sentimentPipeline) {
    const { pipeline } = await import('@xenova/transformers');
    sentimentPipeline = await pipeline('sentiment-analysis');
  }
  
  const result = await sentimentPipeline(text);
  const { label, score } = result[0];
  
  //score range from -100 to 100
  const adjustedScore = (score * 200) - 100;
  
  return { label, score: adjustedScore };
}

export type Props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
};

export type SentimentCount = {
    sentiment: string;
    _count:{
      sentiment:number;
    };
  };

export type SetSentimentType = {
    sentimentArray: SentimentCount[];
    setSentimentArray: React.Dispatch<React.SetStateAction<SentimentCount[]>>
}
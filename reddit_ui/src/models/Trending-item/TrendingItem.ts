import { Subreddit } from "../subreddit/subreddit";
export interface TrendingItem{
    image_src:string;
    title:string;
    description:string;
    subreddit:Subreddit;
}


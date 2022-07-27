export interface Post {
    _id:string,
    title: String,
    content:String,
    image:String,
    creator:{
        email: String,
        userId: String
    }
}
class jobApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    UserJobs(id){
        this.query = this.query.find({user_id:id});
        return this;
    }
    Search(){
        const search = this.queryStr.search ? {
            position:{
                $regex:this.queryStr.search,
                $options: "i"
            }
        }:{};

        this.query = this.query.find({...search}); 
        return this;
    }
    Filter(){
        const queryCopy = {...this.queryStr};
        const removeFields = ["search", "page", "sort"];
        removeFields.forEach((item) => delete queryCopy[item]);
        const jobType = queryCopy.jobType === "all"?{}:queryCopy.jobType? {jobType:queryCopy.jobType}:{};
        const status = queryCopy.status === "all"?{}:queryCopy.status?{status:queryCopy.status}:{};
        this.query = this.query.find({...jobType, ...status});
        return this;
    }
    Sort(){
        switch(this.queryStr.sort){
            case "latest": this.query = this.query.sort({createdAt: -1});
            break;
            case "oldest": this.query = this.query.sort({createdAt: 1});
            break;
            case "a-z": this.query = this.query.collation({locale:'en',strength: 2}).sort({position: 1});
            break;
            case "z-a": this.query = this.query.collation({locale:'en',strength: 2}).sort({position: -1});
            break;
            default: return next();
        }
        return this;
    }
    Pagination(resultPerPage){
        const currentPage = this.queryStr.page || 1;
        const skip = resultPerPage*(currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}


export default jobApiFeatures;
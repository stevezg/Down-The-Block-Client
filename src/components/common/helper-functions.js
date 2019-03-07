export function todaysDate (){
  let date = new Date().toLocaleDateString();
  let dateArr = date.split('/');
  let year = dateArr[2];
  let month = dateArr[0].length===1 ? "0" + dateArr[0] : dateArr[0] ;
  let day = dateArr[1].length===1 ? "0" + dateArr[1] : dateArr[1] ;
  let finalDate = year + "-" + month + "-" + day;
  return finalDate;
}

export function formatDate(dateString){
  let dateArr = dateString.split('-');
  return new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
}

function unabbreviated(str){
  switch(str) {
    case "Mon":
      return "Monday"
    case "Tue":
      return "Tuesday"
    case "Wed":
      return "Wednesday"
    case "Thu":
      return "Thursday"
    case "Fri":
      return "Friday"
    case "Sat":
      return "Saturday"
    case "Sun":
      return "Sunday";
    
    case "Jan":
      return "January"
    case "Feb":
      return "February"
    case "Mar":
      return "March"
    case "Apr":
      return "April"
    case "May":
      return "May"
    case "Jun":
      return "June"
    case "Jul":
      return "July";
    case "Aug":
      return "August"
    case "Sep":
      return "September"
    case "Oct":
      return "October"
    case "Nov":
      return "November";
    case "Dec":
      return "December";
    default:
      return str;
  }
}

export function formatLongDate(dateString){
  let dateArr = dateString.split('-');
  let newDate = new Date(dateArr[0], dateArr[1]-1, dateArr[2]).toDateString();
  //newdate is Wed Jan 02 2019
  dateArr = newDate.split(' ');
  let nameDay = dateArr[0];
  let month = dateArr[1];
  let day = dateArr[2];
  let year = dateArr[3];

  nameDay=unabbreviated(nameDay);
  month = unabbreviated(month);

  return `${nameDay}, ${month} ${day}, ${year}`
}

//global variable: 
let globalArrayOfSearchTerms=[];

//this fn is responsible for updating the global array which keeps track of the search terms and whether or not they were found in each post
//it accepts the id for the post, the part of the post being checked, and the array of search terms 
function contains(id, str, arr){
  for(let i =0; i<arr.length; i++){
    //if this word was already found for this post, or it now includes it, change this word's value to true for this post 
    if(globalArrayOfSearchTerms.find(item=>item.postId===id)[arr[i]]===true || str.toLowerCase().includes((arr[i]).toLowerCase())){
      //this means this search term was found somewhere in the post 
      globalArrayOfSearchTerms.find(item=>item.postId===id)[arr[i]] = true;
    }
    //if its not found in this part of the post, then return false for this post
    else{
      globalArrayOfSearchTerms.find(item=>item.postId===id)[arr[i]] = false;
    }
  }
  //dont care what it returns, the point of it is to update the global arr
  return null;
}

//This search fn will return any post that has ALL of the search terms (each space determines a new term) present somewhere in the post 
export function filterPostsBySearch(terms, posts){
  let searchTerms = terms.toLowerCase().split(" ");

  //reset the global
  globalArrayOfSearchTerms =[];

  //set up the global to be an array of objects, each object having a postId
  for(let i = 0; i<posts.length; i++){
    globalArrayOfSearchTerms.push({"postId": posts[i].props.postId});
  }

  console.log('the global array is', globalArrayOfSearchTerms);

  //for each post, run the contains function that will update the global array accordingly
  return posts.filter(post=>
    {
      let bool = true; 
      // let date = formatLongDate(post.props.date).toLowerCase();

      console.log('DATE IS', post.props.date);

      contains(post.props.postId, post.props.category, searchTerms);

      contains(post.props.postId, post.props.date, searchTerms);

      contains(post.props.postId, post.props.userId.firstName, searchTerms);

      contains(post.props.postId, post.props.content, searchTerms);

      (post.props.comments && post.props.comments.find(comment=>contains(post.props.postId, comment.content, searchTerms))); 


      //grab the object in the array that corresponds to this specific post 
      let obj = globalArrayOfSearchTerms.find(item=>item.postId===post.props.postId)

      //if any of the words in the global array for this post were false, then it doesn't include that search term in the post. and we'll return false for this post
      for (var key in obj) {
        if(obj[key]===false){
          bool=false;
        }
      }
      return(  
        bool    
      );
    }
  )
}

export function filterByCategory(filter, posts){
  return posts.filter(post=>post.props.category===filter);
}

export function formatName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function withinRadius(postCoords, usersCoords, forum){
  let latitudeMin, latitudeMax, longitudeMin, longitudeMax;

  if(forum==='neighbors'){
    latitudeMin = usersCoords.latitude - 0.014631;
    latitudeMax = usersCoords.latitude + 0.014631;
    const oneDegreeLongitude = Math.cos(usersCoords.latitude * Math.PI/180) * 69.172;
    const oneMileLongitudeInDegrees = 1/oneDegreeLongitude;
    longitudeMin = usersCoords.longitude - oneMileLongitudeInDegrees;
    longitudeMax = usersCoords.longitude + oneMileLongitudeInDegrees;
  }

  else{
    latitudeMin = usersCoords.latitude - 0.073155;
    latitudeMax = usersCoords.latitude + 0.073155;
    const oneDegreeLongitude = Math.cos(usersCoords.latitude * Math.PI/180) * 69.172;
    const fiveMilesLongitudeInDegrees = 5/oneDegreeLongitude;
    longitudeMin = usersCoords.longitude - fiveMilesLongitudeInDegrees;
    longitudeMax = usersCoords.longitude + fiveMilesLongitudeInDegrees;
  }

  //within range
  if(postCoords.latitude >= latitudeMin && postCoords.latitude <= latitudeMax && postCoords.longitude >= longitudeMin && postCoords.longitude <= longitudeMax){
    return true
  }
  //not in range
  else{
    return false
  }
  
}
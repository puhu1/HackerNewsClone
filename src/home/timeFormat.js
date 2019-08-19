export const timeAgo = (time)=>{
let d = new Date();
let currentTime = Math.floor(d.getTime() / 1000);
let seconds = currentTime - time;

if (seconds > 2*24*3600) {
    return `${Math.floor(seconds/(24*3600))} days ago`
}

if (seconds > 24*3600) {
  return 'yesterday';
}

if (seconds > 3600) {
  return `${Math.floor(seconds/(3600))} days ago`
}

if (seconds > 1800) {
  return 'Half an hour ago';
}

if (seconds > 60) {
  return Math.floor(seconds/60) + ' minutes ago';
}
}
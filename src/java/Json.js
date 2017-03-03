
export const pretty = obj=>JSON.stringify(obj, null,2);
export const prettyPrint = (obj)=>console.log(pretty(obj));
export default ({
  pretty,
  prettyPrint
});

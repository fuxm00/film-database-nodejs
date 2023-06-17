export const sum = function(items, prop){
    return items.reduce( function(a, b){
        return a + b[prop];
    }, 0);
};
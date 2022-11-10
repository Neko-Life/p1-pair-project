function invoicer (order){
    return `
    Order Id    : ${order.id}
    Name        : ${order.User.username}
    Destination : ${order.destination}
    Pickup at   : ${order.pickupAt}
    DriverName  : ${order.Driver.name}
    
    User rating : ${order.satisfactionPoint}
    `
}

module.exports = invoicer;
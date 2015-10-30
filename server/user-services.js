Meteor.methods({
  userServices(){
    let user = Meteor.users.findOne(this.userId);

    if (user && user.services){
      return(Object.keys(user.services));
    }else{
      return([]);
    }
  }
});

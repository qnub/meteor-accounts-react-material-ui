Accounts.ui.DisplayName = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    const user = Meteor.user();
    let username = '';

    if (user){
      if (user.profile && user.profile.name){
        username = user.profile.name;
      }

      if (user.username){
        username = user.username;
      }

      if (user.emails && user.emails[0] && user.emails[0].address){
        username = user.emails[0].address;
      }
    }

    return {
      name: username
    };
  },

  render(){
    return(<div
      className="accounts-ui__user-name">
        {this.data.name}
    </div>);
  }
});

Accounts.ui.ServiceConfig = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired,
    template: React.PropTypes.element,
  },

  getDefaultProps(){
    return {
      template: undefined
    };
  },

  getInitialState(){
    return {
      updateDisabled: true,
      dialogOpen: false
    }
  },

  updateDisabled() {
    if (this.refs.dialog.isOpen()){
      this.setState({updateDisabled: _.any(this.configurationFields(), (field)=>{
        return this.refs[field.property].getValue().trim() === '';
      })});
    }
  },

  blazeTemplate() {
    let serviceName = this.props.service.name;

    return Template['configureLoginServiceDialogFor' +
                    (serviceName === 'meteor-developer' ?
                     'MeteorDeveloper' :
                     capitalize(serviceName))];
  },

  configurationFields() {
    return this.blazeTemplate().fields();
  },

  save(){
    if(!this.state.updateDisabled){
      // Prepare the configuration document for this login service
      let serviceName = this.props.service.name;
      let configuration = {
        service: serviceName
      };

      // Fetch the value of each input field
      _.each(this.configurationFields(), (field)=>{
        configuration[field.property] = this.refs[field.property].getValue()
          .trim(); // trim() doesnt work on IE8;
      });

      configuration.loginStyle = this.refs.loginStyle.getSelectedValue();

      // Configure this login service
      Accounts.connection.call(
        "configureLoginService", configuration, (error, result)=>{
          if (error){
            Meteor._debug("Error configuring login service " + serviceName,
                          error);
          } else {
            this.cancel();
          }
        });
    }
  },

  show(){
    this.setState({
      dialogOpen: true
    });
  },

  cancel(){
    this.setState({
      dialogOpen: false
    });
  },

  render(){
    let blazeForm = '';

    if (!this.props.template){
      const template = this.blazeTemplate();

      if (template && Blaze){
        blazeForm = <div
          key="blazeForm"
          dangerouslySetInnerHTML={{__html: Blaze.toHTML(template)}} />;
      }
    }

    const fields = this.configurationFields().map((field, index)=>{
      return(<div
        key={index}
        className="accounts-ui__field accounts-ui__field_variant_config">
          <MUI.TextField
            ref={field.property}
            hintText={`Enter ${field.label}`}
            floatingLabelText={field.label}
            onChange={this.updateDisabled}/>
      </div>);
    });

    const template = <div
      key="externalTemplate">
        {this.props.template}
    </div>;

    const actions = [
      {
        text: t9n('I\'ll do this later'),
        onTouchTap: this.cancel
      },
      {
        text: t9n('Save Configuration'),
        onTouchTap: this.save,
        disabled: this.state.updateDisabled
      }
    ];

    return(<div
      className={`accounts-ui__config accounts-ui__config_variant_${this.props.service.name}`}>
        <MUI.Dialog
        ref="dialog"
        title={`${t9n('Configure')} ${this.props.service.name}`}
        actions={actions}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        open={this.state.dialogOpen}>
          {blazeForm}
          {template}
          <p>
            {t9n('Now, copy over some details')}.
          </p>
          {fields}
          <p>
            {t9n('Choose the login style')}:
          </p>
          <MUI.RadioButtonGroup ref="loginStyle" name="loginStyle" defaultSelected="popup">
            <MUI.RadioButton
              className="accounts-ui__radio"
              value="popup"
              label={t9n('Popup-based login (recommended)')}/>
            <MUI.RadioButton
              className="accounts-ui__radio"
              value="redirect"
              label={t9n('Redirect-based login')}/>
          </MUI.RadioButtonGroup>
          <p>
            {t9n('Read more about')}
            &nbsp;
            <a
              href="https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients#popup-versus-redirect-flow"
              target="_blank">
              {t9n('redirect-based login')}
            </a>
          </p>
        </MUI.Dialog>
    </div>);
  }
});

# qnub:accounts-react-material-ui

Meteor sign up and sign in [react](http://facebook.github.io/react/index.html) components (and much more!) with [material ui](http://material-ui.com/#/home).

This package based on [accounts-ui-unstyled](https://github.com/meteor/meteor/tree/devel/packages/accounts-ui-unstyled).

## Install

Install at least one accounts login service like `accounts-password`, `accounts-facebook` or any other:

    meteor add accounts-password

Install package:

    meteor add qnub:accounts-react-material-ui

Run on client side:

    injectTapEventPlugin();

To enable `onTouchTap` event, if you already don't.

Also you should have installed and configured [material ui](http://material-ui.com/#/home) in your project. If you don't — try some of [existed packages](https://atmospherejs.com/?q=material%20ui).

## Config

Supports standard [Accounts.ui.config](http://docs.meteor.com/#/full/accounts_ui_config).

Define preferred button colors for services in `public.accounts.styles.<service_name>` part of [meteor settings](http://docs.meteor.com/#/full/meteor_settings):

    {
        "public": {
            "accounts": {
                "styles": {
                    "services": {
                        "facebook": {
                            "backgroundColor": "#46629e",
                            "labelColor": "#ffffff",
                            "disabledBackgroundColor": "#545966",
                            "disabledLabelColor": "#aca4a4",
                            "rippleColor": "#ffffff",
                            "fullWidth": true,
                            "style": {
                                "width": "300px"
                            }
                        }
                    }
                }
            }
        }
    }

Color settings have same meanings as for [RaisedButton Material UI](http://material-ui.com/#/components/buttons) properties.

## Usage

Because dropdown isn't very good solution i prefer you to use separate views and routes for different login states and direct user depending on it. Example:

    {Meteor.userId() ? <MUI.RaisedButton label="Logout" onClick={Meteor.logout} /> : <MUI.RaisedButton label="Login" linkButton={true} href="/login" />}

Then on `/login` page use `<Accounts.ui.LoginFormSet redirect={handleLogin}/>` component to display login form. This form displays different components depending of configuration and current state. For example for authenticated user it shows password change form.

Where optional `redirect` property can be string target URL or function like this (for [kadira:flow-router](https://atmospherejs.com/kadira/flow-router)):

    handleLogin = function(){
      FlowRouter.go('/');
    };

**NOTE:** Meteor's core `accounts-base` (which used here) package already use this paths (on server) for own purposes:

    /verify-email
    /reset-password
    /enroll-account

Also you need to place `<Accounts.ui.Dialogs />` (it's invisible component with popup dialogs) in your root (with `/` URL) page or even in main layout to allow user do restore password, verify email and other two-step things.

## WiKi

Additional info can be obtained from [WiKi on GitHub](https://github.com/qnub/meteor-accounts-react-material-ui/wiki).

## Components

Package contains different components which can be used separately:

* `Accounts.ui.LoginFormSet` — main and most complete login form.
* `Accounts.ui.Dialogs` — invisible component with popup dialogs to interact with two-step things.
* `Accounts.ui.LoginForm` — `accounts-password` part of `Accounts.ui.LoginFormSet`.
* `Accounts.ui.LoginServices` — OAuth login buttons.

## SSR

Generally it work with server side rendering, but accounts package haven't some features on server side, so pages have differences on client and server (and you'll see warnings in console).

### Language codes and contributions (copyed from [softwarerero:accounts-t9n](https://github.com/softwarerero/meteor-accounts-t9n.git) package and updated)

Code   | Language                | Contributor(s)
------ | ----------------------- | -------------
ar     | Arabic                  | eahefnawy
ca     | Catalan                 | ixdi
cs     | Czech                   | mdede
da     | Danish                  | LarsBuur
de     | German                  | softwarerero, robhunt3r, sclausen, sarasate
el     | Greek                   | mutil
es     | Spanish                 | softwarerero, robhunt3r
es_ES  | Spanish for Spain       | maomorales
fa     | Farsi                   | pajooh
fr     | French                  | djhi
he     | Hebrew                  | noamyoungerm
hr     | Croatian                | tnedich
hu     | Hungarian               | balazskiss
id     | Indonesian              | hellstad
it     | Italian                 | splendido
ja     | Japanese                | y-ich
kh     | Khmer                   | yuomtheara
ko     | Korean                  | candicom, buo
nl     | Dutch                   | willemx, louwers
no_NB  | Norwegian bokmål        | kjetilge
pl     | Polish                  | pwldp, wareczek
pt     | Portuguese (Brasil)     | alanmeira, Tadeu Caldararo
pt_PT  | Portuguese (Portugal)   | tdbs
ro     | Romanian                | alexhuszar
ru     | Russian                 | timtch
sk     | Slovak                  | MartinBucko, aladinko
sl     | Slovenian               | alesvaupotic
sv     | Swedish                 | timbrandin
tr     | Turkish                 | serkandurusoy
uk     | Ukrainian               | SkeLLLa
vi     | Vietnamese              | olragon
zh_cn  | Simplified Chinese      | laosb
zh_hk  | Hong Kong Chinese       | daveeel
zh_tw  | Taiwan Chinese          | victorleungtw

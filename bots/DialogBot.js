const { ActivityHandler } = require("botbuilder");
const USER_PROFILE = 'user_profile';

class DialogBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        this.dialog = dialog;
        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty('dialogState');
        this.userProfile = userState.createProperty(USER_PROFILE);
        this.userState = userState;

        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            const userProfile = this.userProfile.get(context, new UserProfile());
            
            if (userProfile.ID > 0) {
                await sendMainMenu(context);
                await next(); 
            }

            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);
            
            if (userProfile.ID > 0) {
                await sendMainMenu(context);
            }

            await next();
        });
    }

    async run(context) {
        await super.run(context);
    
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }

    async sendMainMenu(context) {
        const menuItems = new lowDbInterface('/mai_menu/mainMenu.json').getArrayFromDb('menuItems');
        let arMenu = [];
        
        for (let i = 0; i < menuItems.length; i++) {
            arMenu.add(menuItems[i].name);
        }
    }
}

module.exports = DialogBot;
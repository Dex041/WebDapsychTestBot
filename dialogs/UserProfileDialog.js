const { ComponentDialog, NumberPrompt, WaterfallDialog } = require("botbuilder-dialogs");
const UserProfile = require('../UserProfile');

const USER_PROFILE = 'user_profile';
const ID_PROMPT = 'prompt_id';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';



class UserProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new NumberPrompt(ID_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.idStep.bind(this),
            this.idStepConfirm.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;

    }

    async idStep(step) {
        return await step.prompt(ID_PROMPT, 'Please enter your access code.');
    }

    async idStepConfirm(step) {        
        const userProfile = await this.userProfile.get(step.context, new UserProfile());
        userProfile.ID = step.result.value;

        return await step.endDialog();
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
}

module.exports = UserProfileDialog;
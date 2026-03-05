const fs = require('fs');
const path = require('path');

// Directory containing all translation files
const messagesDir = path.join(__dirname, 'messages');

// New keys to add to all language files
const newKeys = {
    navigation: {
        features: "Features",
        method: "Method",
        schools: "Schools",
        testimonials: "Testimonials",
        getStarted: "Get Started",
        getStartedFree: "Get Started Free"
    },
    footer: {
        product: {
            title: "Product",
            app: "App",
            parents: "Parents",
            schools: "Schools",
            ngos: "NGOs"
        }
    },
    auth: {
        welcomeBack: "Welcome back",
        joinAdventure: "Join the adventure",
        fullName: "Full name",
        createPassword: "Create a password",
        orEmail: "or by email",
        signIn: "Sign in",
        createAccount: "Create my account",
        signUpFree: "Sign up free",
        termsText: "By creating an account, you accept our",
        termsLink: "Terms of Service",
        privacyLink: "Privacy Policy",
        trustItems: {
            certified: "Programs certified by education experts",
            countries: "Available in more than 38 countries",
            learners: "Over 500,000 children learn every day"
        },
        quote: "Every child is a sleeping genius.",
        quoteSubtext: "FreeGeny transforms every moment into an opportunity to learn, grow and wonder.",
        illustrationAlt: "Child learning while having fun"
    }
};

// Read all JSON files in the messages directory
const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));

console.log(`Found ${files.length} language files to update\n`);

files.forEach(file => {
    const filePath = path.join(messagesDir, file);
    const lang = file.replace('.json', '');

    try {
        // Read existing translations
        const content = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(content);

        // Add new navigation keys
        if (!translations.navigation) {
            translations.navigation = {};
        }
        translations.navigation = {
            ...newKeys.navigation,
            ...translations.navigation
        };

        // Add new footer.product section
        if (!translations.footer) {
            translations.footer = {};
        }
        translations.footer.product = newKeys.footer.product;

        // Update auth keys
        if (!translations.auth) {
            translations.auth = {};
        }
        translations.auth = {
            ...translations.auth,
            ...newKeys.auth
        };

        // Write back to file with proper formatting
        fs.writeFileSync(filePath, JSON.stringify(translations, null, 4), 'utf8');
        console.log(`✓ Updated ${file}`);

    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log(`\n✅ Successfully updated ${files.length} language files!`);
console.log('\nNote: The translations are in English. Please review and translate them appropriately for each language.');

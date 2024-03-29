import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import Select, { StylesConfig } from 'react-select';
// import { getStoredLanguage, setStoredLanguage } from 'utils/commonUtils';
// import { Language, MultiLanguage } from 'types/languageDropdown';
// import { useGlobalContext } from 'contexts'
// import { apis } from 'services/apis'
// import { isLogin } from 'services/Auth';
// import LanguageChangeConfirmation from '../LanguageChangeConfirmation';
// import { useRouter } from 'next/router';
function LanguageDropdown() {
    // const { i18n } = useTranslation()
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    // let { user } = useGlobalContext()
    // const [show, setShow] = useState<boolean>(false)
    const [finalConfirmation, setFinalConfirmation] = useState(false);
    const [language, setLanguage] = useState('en-US');
    // const userId = user?.data?.id;

    const languageOptions: any[] = [
        { value: 'en-US', label: 'English' },
        { value: 'fr-FR', label: 'Français' }
    ];
    const customStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? 'transparent' : provided.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px transparent' : provided.boxShadow,
            border: 0,
            outline: '1px solid #fff',
            // padding: '0px',
            marginRight: '12px',
            '&:hover': {
                borderColor: state.isFocused ? 'transparent' : provided.borderColor,
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            // padding: '4px', // Adjust the padding to reduce the size of the indicator
            svg: {
                width: '15px', // Change the width of the SVG icon
                height: '15px', // Change the height of the SVG icon
                color: '#ff5405'
            },
            transition: 'transform 0.3s ease-in-out',
            transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            // color: '#ff5405'
        }),
        option: (provided, state) => {
            const isLastOption = state.options.indexOf(state.data) === state.options.length - 1;

            return {
                ...provided,
                backgroundColor: state.isFocused && !state.isSelected ? '#EDEDED' : 'transparent',
                color: state.isSelected ? '#4d4d4f' : provided.color,
                cursor: 'pointer',
                borderBottom: isLastOption ? 'none' : '1px solid #d2d2d3',
                borderRadius: 0,
                '&:hover': {
                    backgroundColor: '#EDEDED',
                    color: '#4d4d4f',
                    borderColor: isLastOption ? '#d2d2d3' : provided.borderColor,
                    borderRadius: 0,
                },
            };
        }
        , menu: (provided) => ({
            ...provided,
            border: "none",
            margin: 0,
            padding: 0,
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1607843137)",
            zIndex: 1,
            borderRadius: 0,
            width: '160px', // Set width for the dropdown menu

        }),
        menuList: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            boxShadow: "none",
            borderTop: "none",
            borderBottom: "none",
            borderRadius: 0, // Remove border radius for the menuList
            fontSize: '12px',
            width: '160px', // Set width for the dropdown menu
            fontFamily: 'berninoFont, sans-serif',
            '&:hover': {
                borderBottom: '1px solid #d2d2d3'
            },
            '@media screen and (max-width: 768px)': {
                ...provided,
                width: '100%',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#ff5405", // Change control label default text color
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '600',

        }),

        // Other styles as needed for different components like placeholder, singleValue, etc.
    };

    // const selectLanguage = () => {
    //     setFinalConfirmation(true)
    // }

    // const handleClose = (): void => {
    //     setFinalConfirmation(false)
    // }
    useEffect(() => {
        if (finalConfirmation) {
            updateLanguage()
        }
        async function updateLanguage() {
            // i18n.changeLanguage(language);
            try {
                // if (isLogin()) {
                //     const response = await apis.userUpdateContentLocale(userId, language);
                //     if (response?.data?.status === 200) {
                //         setStoredLanguage(response?.data?.data?.attributes?.contentLocale ?? "en-US");
                //     }
                // }
                
                setFinalConfirmation(false);
            } catch (error) {
                console.log(error)
            }
        }
    }, [finalConfirmation, language])
//finalConfirmation, userId, language, router
    const handleLanguageChange = async (selectedOption: any) => {
        const storedLanguage = localStorage.getItem("selectedLanguage")
        setLanguage(selectedOption.value)
        // below condition if user select same language again then does show confirmation language popup
        if (selectedOption.value === storedLanguage) {
            return null;
        }
        else{
            localStorage.setItem("selectedLanguage",selectedOption.value );
            alert(`You have selected '${selectedOption.value === "en-US"? "English": "Français"}' as your new Language. This change will be applied ONLY TO YOU across the application. It will now refresh to apply this change  `);
            window.location.reload();
        }
    };

    const defaultLanguage = languageOptions.find(option => option.value === localStorage.getItem("selectedLanguage"));
    // Handle the default language label when language is not available in local storage
    let placeholderValue = languageOptions[0]; // Default to English if defaultLanguage is not found
    if (defaultLanguage) {
        placeholderValue = defaultLanguage;
    }

    return (
        <>
            <Select options={languageOptions}
                classNamePrefix='select'
                onChange={handleLanguageChange}
                styles={customStyles}
                isSearchable={false}
                value={defaultLanguage}
                placeholder={placeholderValue.label} // Set placeholder explicitly to the label of the default language
                defaultValue={defaultLanguage} // Set the defaultValue to ensure the default value is explicitly selected
                menuIsOpen={menuIsOpen}
                onMenuOpen={() => setMenuIsOpen(true)}
                onMenuClose={() => setMenuIsOpen(false)}
            />
            {/* {show && <LanguageChangeConfirmation show={show}
                handleClose={handleClose} selectLanguage={selectLanguage}
                finalConfirmation={finalConfirmation} language={language} />} */}
        </>
    );
}

export default LanguageDropdown
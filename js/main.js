const OPERATIONS = {
    ADD_DECIMAL: 'add_decimal',
    SUBSTRACT: 'substract',
    SUM: 'sum',
    MULTIPLIY: 'multiply',
    DIVIDE: 'divide',
    DELETE: 'delete',
    RESET: 'reset',
    GET_RESULT: 'get_result',
};

const possibleThemeClasses = {
    1: 'theme-dark',
    2: 'theme-light',
    3: 'theme-purple',
};

const UI = (() => {
    let screenValue = '0';
    const elements = {
        themeSwitch: document.querySelector('#slider'),
        screen: document.querySelector('#screen'),
        buttonsContainer: document.querySelector('#buttons_container'),
    };

    return {
        elements,
        printResult: (value) => {
            console.log({ value, screenValue });
            screenValue = +(screenValue + value).toString();
            elements.screen.textContent = screenValue;
        },
        clearScreen: () => {
            screenValue = '0';
        },
        getScreenValue: () => {
            return screenValue;
        },
        changeTheme: (value) => {
            document.querySelector('html').classList.value =
                possibleThemeClasses[value];
            localStorage.setItem('theme', value);
        },
        getSavedTheme: () => {
            const themeSaved = localStorage.getItem('theme');
            if (!themeSaved || isNaN(themeSaved)) {
                return 1;
            }
            return themeSaved;
        },
        setSavedTheme: (theme) => {
            elements.themeSwitch.value = theme;
        },
    };
})();

const CONTROLLER = (() => {
    const operationsAndAmounts = [];
    const operations = {
        multiply: (a, b) => a * b,
        sum: (a, b) => a + b,
        divide: (a, b) => a / b,
        substract: (a, b) => a - b,
    };
    return {
        addOperation: (operation) => {
            if (
                operationsAndAmounts[operationsAndAmounts.length - 1] ===
                operation
            ) {
                return;
            }
            operationsAndAmounts.push(operation);
            console.log(operationsAndAmounts);
        },
        addAmount: (amount) => {
            operationsAndAmounts.push(amount);
            console.log(operationsAndAmounts);
        },
        getLastValue: () => {
            return operationsAndAmounts[operationsAndAmounts.length - 1];
        },
        getResult: () => {
            let res = 0;
            if (isNaN(operationsAndAmounts[operationsAndAmounts.length - 1])) {
                operationsAndAmounts.pop();
            }
            const resu = operationsAndAmounts.reduce((prev, curr, idx) => {
                console.log({ curr, prev, res, idx });
                if (idx === 1) {
                    console.log({ curr, prev, res });
                    res = prev;
                }

                if (isNaN(curr)) {
                    console.log({ curr, prev, res });
                    res = operations[curr](res, operationsAndAmounts[idx + 1]);
                }
                return res;
            });
            console.log({resu,  operationsAndAmounts});
            return resu
        },
        resetOperationsAndAmounts: () => {operationsAndAmounts.length = 0}
    };
})();

const app = ((ui, ctrl) => {
    const setEventListeners = () => {
        ui.elements.buttonsContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const { target } = e;
            const { operation, value } = target.dataset;
            if (operation) {
                console.log(operation);
                if (!+ui.getScreenValue()) {
                    return;
                }
                ctrl.addAmount(+ui.getScreenValue());
                ctrl.addOperation(operation);
                ui.clearScreen();
            }

            if (operation === 'get_result') {
                const result = ctrl.getResult();
                ui.clearScreen();
                ui.printResult(result);
                ctrl.resetOperationsAndAmounts(result)
                return;
            }

            if (target.dataset.value) {
                ui.printResult(target.dataset.value);
            }
        });
        ui.elements.themeSwitch.addEventListener('change', (e) =>
            ui.changeTheme(+e.target.value)
        );
    };

    return {
        init: () => {
            const savedTheme = ui.getSavedTheme();
            ui.setSavedTheme(savedTheme);
            ui.changeTheme(savedTheme);
            setEventListeners();
        },
    };
})(UI, CONTROLLER);

window.addEventListener('DOMContentLoaded', app.init);

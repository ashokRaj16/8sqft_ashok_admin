

const TestComponent = () => {

    const testValues = {
        lat: '105.250250',
        long: "-125.2504666"
    }

    const testBody = () => {
        return "new string"
    }
    return (
        <div style={{ margin: 25}} >
        <h1>This is test component</h1>
        <p>
            document.createElement: Creates a new element in memory (not yet attached to the DOM).
            innerText: Sets the text inside the  element to "My Website".
            document.body.append:
            Adds the element to the end of the without affecting any existing content.
            IIFE: Immediately logs the headerText and appends it to the.
        </p>
        <span>
            { testBody() }
        </span>

        <p>Latitude: { testValues.lat } </p>
        <p>longitude: { testValues.long }</p>
        </div>
    )
}

export default TestComponent;
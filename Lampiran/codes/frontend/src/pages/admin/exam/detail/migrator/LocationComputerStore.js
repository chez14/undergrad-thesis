import { decorate, observable } from "mobx";

class ComputerLocationStore {
    locationComputer = [];
}

decorate(ComputerLocationStore, {
    locationComputer: observable
})

export default ComputerLocationStore;
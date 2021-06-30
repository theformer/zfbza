import {
    decorate,
    observable,
    action,
    computed
} from 'mobx'
class TestStore {
   name = ''
}
decorate(TestStore, {
    name: observable
})

export default TestStore
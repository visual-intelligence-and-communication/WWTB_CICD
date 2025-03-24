const { atom } = require("recoil");

export const searchResultAtom = atom({
  key: "searchResultAtom", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const clikedDataSectionMenuAtom = atom({
  key: "clikedDataSectionMenuAtom",
  default: ''
})

export const clikedMenuItemIdAtom = atom({
  key: "clikedMenuItemIdAtom",
  default: -1
})

export const currentMenuItemArrayIdAtom = atom({
  key: "currentMenuItemArrayIdAtom",
  default: -1
})

export const currentStoryTextBox = atom({
  key: "currentStoryTextBox",
  default: -1
})

export const scrollCurrentPosForBottomNavAtom = atom({
  key: "scrollCurrentPosForBottomNavAtom",
  default: ""
})

export const storiesData = atom({
  key: "storiesData",
  default: []
})

export const forceUpdate = atom({
  key: "forceUpdate",
  default: false
})

export const currentToolBox = atom({
  key: "currentToolBox",
  default: ""
})
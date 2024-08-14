import formRegistry from './formRegistry';

class FormGroupManager {
  constructor() {
    this.formGroups = {
      themeGroup: {
        defaultTab: 'Theme',
        tabs: ['Theme', 'Logo'],
      },
      logoGroup: {
        defaultTab: 'Geoprocessing',
        tabs: ['Geoprocessing', 'Searchbar'],
      },
      dataGroup: {
        defaultTab: 'Theme',
        tabs: ['Theme', 'Logo'],
      },
      // Agrega aquí más grupos de formularios según sea necesario
    };
  }

  getTabs(groupName) {
    return this.formGroups[groupName]?.tabs || [];
  }

  getDefaultTab(groupName) {
    return this.formGroups[groupName]?.defaultTab || '';
  }

  getFormComponent(formName) {
    return formRegistry[formName] || null;
  }

  addGroup(groupName, defaultTab, tabs) {
    this.formGroups[groupName] = { defaultTab, tabs };
  }
}

export default FormGroupManager;

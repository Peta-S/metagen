import { initViewManager } from './ui/view-manager.js';
import { metaGroupsService } from './core/meta-groups-service.js';

document.addEventListener('DOMContentLoaded', async () => {
  initViewManager();  // setAllSchemas
  metaGroupsService.setAllSchemas();
});

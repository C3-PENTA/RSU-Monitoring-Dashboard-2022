import { from } from 'rxjs';
import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { IDiagramResData } from '@/interface/interfaceHierarchyTree';

export const getDiagramData = () => from(http.get<IDiagramResData>(APIs.GET_DIAGRAM_DATA));

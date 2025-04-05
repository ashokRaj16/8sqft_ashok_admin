import { useSortable} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import { FaEye, FaGripVertical, FaPencilAlt, FaTrash } from 'react-icons/fa'
import { CTableRow, CTableDataCell, CButton, CBadge } from '@coreui/react';
import { formattedDate } from '../../../utils/date';

const getStatusBadge = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'secondary'
    default:
      return 'primary'
  }
}


const SortableRows = ({item, changeStatusHandler, deleteHandler, viewHandlder, index}) => {
    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: item.sequence_no });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

   

    return (
        <CTableRow ref={setNodeRef} style={style} { ...attributes } >
            <CTableDataCell { ...listeners} style={{ cursor: 'grab'}}>
                <FaGripVertical color="dark-grey" style={{ fontWeight: 'normal', opacity: 0.7 }} />
            </CTableDataCell>
            <CTableDataCell>{item.id}</CTableDataCell>
            <CTableDataCell>{item.property_title}</CTableDataCell>
            <CTableDataCell>{item.city_name}</CTableDataCell>
            <CTableDataCell>{item.categories }</CTableDataCell>
            <CTableDataCell>{item.sequence_no || '-'}</CTableDataCell>
                    <CTableDataCell>
                      {formattedDate(item?.sp_publish_date) || '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        onClick={() => changeStatusHandler(item.tps_id, item.sponsared_status === '1' ? "0" : '1')}
                       color={getStatusBadge(item.sponsared_status === '1' ? 'active' : 'inactive')} >
                        { item.sponsared_status === '1' ? 'Active' : 'Inactive' }
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="primary"
                        onClick={() => viewHandlder(promotion.tps_id)}
                        className="me-2 mb-1"
                      >
                        <FaEye color="white" />
                      </CButton>

                      <CButton
                        size="sm"
                        color="danger"
                        onClick={() => deleteHandler(promotion.tps_id)}
                        className="me-2 mb-1"
                      >
                        <FaTrash color="white" />
                      </CButton>
                    </CTableDataCell>
        </CTableRow>
    )
}

export default SortableRows;
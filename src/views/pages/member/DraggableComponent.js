import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { FaGripVertical } from "react-icons/fa";
import { CSS } from '@dnd-kit/utilities'

import Loader from './Loader'

const itemList = [
    { id: 1, name: 'Ashok Raj', address: 'Nashik', role: 'Admin' },
    { id: 2, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin' },
    { id: 3, name: 'Mr. X', address: 'Nagar', role: 'Editor' },
    { id: 4, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin' },
    { id: 5, name: 'Mahesh', address: 'Pune', role: 'Sale Person' },
    { id: 6, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor' },
    { id: 7, name: 'John Doe', address: 'Pune', role: 'Market Head' }
]

const DraggableComponent = (props) => {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(itemList)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragEnd = (event) => {
        setLoading(true)
        const { active, over} = event;
        if(active.id != over.id) {
            // call api here them update items.
            console.log(active, over)
            setItems((item) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
        setLoading(false)
    }

    return (
        <div>
            { loading && <Loader />}
            <CCard className="mb-4">
                <CCardHeader>
                    <h1>Records</h1>
                </CCardHeader>
                <CCardBody>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map((item) => item.id)}>
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>
                                    <FaGripVertical size={16} color="gray" style={{ marginRight: 5 }} />
                                </CTableHeaderCell>
                                <CTableHeaderCell>Sr</CTableHeaderCell>
                                <CTableHeaderCell>Name</CTableHeaderCell>
                                <CTableHeaderCell>Address</CTableHeaderCell>
                                <CTableHeaderCell>Role</CTableHeaderCell>
                                <CTableHeaderCell>Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                items && items.map((item, index) => (
                                    <SortableRows key={item.id} item={item} index={ index } />
                                ))
                            }
                        </CTableBody>
                    </CTable>
                    </SortableContext>
                    </DndContext>
                </CCardBody>
            </CCard>
        </div>
    )
}


const SortableRows = ({item, index}) => {
    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: item.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return (
        <CTableRow ref={setNodeRef} style={style} { ...attributes } >
            <CTableDataCell { ...listeners} style={{ cursor: 'grab'}}>                
                <FaGripVertical color="dark-grey" style={{ fontWeight: 'normal', opacity: 0.7 }} />
            </CTableDataCell>
            <CTableDataCell>{index}</CTableDataCell>
            <CTableDataCell>{item.name}</CTableDataCell>
            <CTableDataCell>{item.address}</CTableDataCell>
            <CTableDataCell>{item.role }</CTableDataCell>
            <CTableDataCell><FaPencil /></CTableDataCell>
        </CTableRow>
    )
}

export default DraggableComponent;
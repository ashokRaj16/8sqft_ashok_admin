export const updatePromotion = async (req, res) => {
    try {
        
        const { updatedItems } = req.body;
        if(!updatedItems || !Array.isArray(updatedItems)) {
            res.status(400).json({ message: "Invalid req data."})
        }
        
        let pool = await pool.getConnection();
        await pool.beginTransaction();

        array.forEach( async (element) => {
            let query = `UPDATE tbl_property_sponsared SET sequence_no = ? WHERE id = ?`;
            await pool.query(query, [element.sequence_no, element.id] )
        });
        
        await pool.commit();
        res.status(200).json({ message: 'Update success...'})
    }
    catch(error) {
        await pool.rollback();
        console.log('Error:', error)
    }
}

// real-time updates.
// import io = require('socket.io')(server);
let io;
io.on('connection', (socket) => {
    console.log('connected!!!')

    socket.on('updateSequence', async (updatedItems) => {
        
        if(!updatedItems || !Array.isArray(updatedItems)) {
            io.emit('updateError', { message: 'Invalid Request data.'})
            return;
        }

        let pool = await pool.getConnection();
        try {
            
            await pool.beginTransaction();
    
            array.forEach( async (element) => {
                let query = `UPDATE tbl_property_sponsared SET sequence_no = ? WHERE id = ?`;
                await pool.query(query, [element.sequence_no, element.id] )
            });
            
            await pool.commit();
            io.emit('sequenceUpdated', updatedItems)

        }
        catch(error) {
            await pool.rollback();
            console.log('Error:', error)
        }
    })
})
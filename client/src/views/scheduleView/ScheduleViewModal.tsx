import './ScheduleViewModal.scss';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

type ScheduleDataType = {
  time: string
  title: string
  date: string
  type: string
  id: string
}

interface ScheduleViewModalProps {
  selectedSpectacle: ScheduleDataType
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ScheduleViewModal: React.FC<ScheduleViewModalProps> = ({ selectedSpectacle, setShowModal }) => {

  const [ticketNumber, setTicketNumber] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');

  console.log(selectedSpectacle)

  const addSale = async () => {
    if (ticketNumber === 0) {
      alert('Eroare: Alegeti numarul de bilete')
      return
    }

    const confirmed = window.confirm("Sigur vrei să finalizezi vânzarea?");
  if (!confirmed) {
    return; 
  }

    const randomId = uuid();

    try {
      const response = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: randomId,
          quantity: ticketNumber,
          payment_method: paymentMethod,
          total_sum: totalPrice(),
          type: selectedSpectacle.type,
          title: selectedSpectacle.title,
          schedule_id: selectedSpectacle.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return
      }

      const printResponse = await fetch('http://localhost:5000/api/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedSpectacle.title,
          date: selectedSpectacle.date,
          time: selectedSpectacle.time,
          price: `${totalPrice()} Lei`,
          quantity: ticketNumber
        })
      });

      if (!printResponse.ok) {
        const errorData = await printResponse.json();
        // alert('Eroare la tipărirea biletelor: ' + errorData.error);
      } else {
        alert(`Succes la vanzarea a ${ticketNumber} ${ticketNumber === 1 ? 'bilet' : 'bilete'}: 
          ${selectedSpectacle.title} ${selectedSpectacle.date.split('-').reverse().join('-')} ${selectedSpectacle.time} ${totalPrice()} de lei`)
      }

      setShowModal(false);
    } catch (error) {
      alert('Eroare la vanzare: ' + error)
    }
  }


  const totalPrice = (): number => {
    if (selectedSpectacle.type === 'Standart') return 100 * ticketNumber;
    else return 150 * ticketNumber
  }


  return (
    <div className="scheduleModal">
      <h2 className="scheduleModal__title">{selectedSpectacle.title} ({selectedSpectacle.type}) {selectedSpectacle.date}</h2>
      <select className='scheduleModal__select' name="payment-method" id="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="cash">Numerar</option>
        <option value="card">Card</option>
      </select>
      <div className="scheduleModal__ticket-number">
        <label htmlFor="tickets-number">Numarul de bilete: </label>
        <input type="number" id="tickets-number" min={1} value={ticketNumber} onChange={(e) => setTicketNumber(Number(e.target.value))} />
      </div>
      <div className='scheduleModal__total'>Total: <span>{totalPrice()} Lei</span></div>
      <div className="scheduleModal__buttons">
        <button className="scheduleModal__accept" onClick={() => (setShowModal(false), addSale())}>Confirma</button>
        <button className="scheduleModal__cancel" onClick={() => setShowModal(false)}>Declina</button>
      </div>
    </div>
  )
}

export default ScheduleViewModal;
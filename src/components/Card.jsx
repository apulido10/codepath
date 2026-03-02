import { useState } from 'react'
import '../App.css'

export default function Card({ image, title, rating, info }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <div className="card-container">
                <div className="card-img-wrapper">
                    <img src={image} />
                </div>
                <h1>{title}</h1>
                <div>Rating: {rating}</div>
                <div className='more-info-button' onClick={() => setShowModal(true)}>
                    More Info
                </div>
            </div>

            {showModal && (
                <div className='modal-overlay' onClick={() => setShowModal(false)}>
                    <div className='modal-card' onClick={(e) => e.stopPropagation()}>
                        <img src={image} className='modal-image' />
                        <h2>{title}</h2>
                        <div className='modal-rating'>Rating: {rating}</div>
                        <p className='modal-info'>{info}</p>
                        <div className='modal-close' onClick={() => setShowModal(false)}>Close</div>
                    </div>
                </div>
            )}
        </>
    )
}

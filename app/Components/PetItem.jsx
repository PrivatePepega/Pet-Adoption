

import Image from "next/image"



const PetItem = ({pet, adoptPet, disabled, inProgress}) => {
  return (
    <div className="item">
        <div className="image">
        <Image
            src={pet.picture}
            alt=""
            width={500}
            height={500}
        />
        </div>
        <div className="info-holder">
            <div>
                <b>Name:</b> {pet.name}
            </div>
            <div>
                <b>Age:</b> {pet.age}
            </div>
            <div>
                <b>Breed:</b> {pet.breed}
            </div>
            <div>
                <b>Location:</b> {pet.location}
            </div>
            <div>
                <b>Description:</b> {pet.description}
            </div>
        </div>
        <div className="action-menu">
            <button
            disabled={disabled || inProgress}
            className="action-button"
            onClick={adoptPet}
            >
            {disabled ? "Happily Adopted!" : "Adopt"}
            </button>
        </div>
    </div>

  )
}

export default PetItem
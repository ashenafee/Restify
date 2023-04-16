import React from "react";
import './styles.css';

const PropertyCard = ({ property }) => {
  const { name, location, rating, availabilitiesOfProperty, imagesOfProperty } = property;

  // remove later
  const renderAvailability = () => {
    console.log(name + " " + imagesOfProperty)
    if (availabilitiesOfProperty && availabilitiesOfProperty.length > 0) {
      return availabilitiesOfProperty.map(availability => (
        <div key={availability.id}>
          Availability: {availability.start_date} - {availability.end_date}
          <br />
          Price per night: ${availability.price_per_night}
        </div>
      ));
    } else {
      return <div>No availability information</div>;
    }
  };

  return (
    <div className="card mb-4 box-shadow">
    {/* show the first image of the imagesOfProperty */}
    <div
      className="image-container card-img-top"
      style={{
        backgroundImage:
          imagesOfProperty && imagesOfProperty.length > 0
            ? `url(${imagesOfProperty[0].image})`
            : "none",
      }}
      alt={`Image of ${name}`}
    ></div>

    <div className="py-3 px-3">
        <h2>{name}</h2>
        <p>Location: {location}</p>
        <p>Rating: {rating}</p>

        {/* remove later */}
        {renderAvailability()}
      </div>
    </div>
  );
};

// const PropertyGrid = ({ properties }) => {
//     return (
//       <Container>
//         <Row>
//           {/* Loop through properties array and render PropertyCard component */}
//           {properties.map((property) => (
//             <Col key={property.id} xs={12} sm={6} md={4} lg={4} xl={4}>
//               <PropertyCard property={property} />
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     );
//   };

export default PropertyCard;
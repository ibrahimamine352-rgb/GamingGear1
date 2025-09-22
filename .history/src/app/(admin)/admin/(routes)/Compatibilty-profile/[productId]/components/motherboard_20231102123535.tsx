import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody, CardFooter } from '@nextui-org/react'

type motherboardpar={
motherboards:Product []
}


const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
  return (
    <div>

          
        <div className='sm:w-full md:w-96 w-96'>
          
        </div>
        <Card>
            <CardHeader>
            <Input type='text' placeholder='Search'/>
            </CardHeader>
            <CardBody>

            </CardBody>
            <CardFooter>

            </CardFooter>
        </Card>
        <div>

        </div>

    </div>
  )
}


export default MotherboardCOl
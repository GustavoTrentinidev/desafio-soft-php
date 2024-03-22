<?php
    namespace App\Tests;
    use PHPUnit\Framework\TestCase;
    use App\Services\CategoryService;
    use App\Exceptions\CustomException;


class CategoryTest extends TestCase {

    public function testGETCategoriesWithoutMethodArgument () {

        $actualReturn = json_decode(CategoryService::getTestInstance()::readCategories());

        if(count($actualReturn) == 0){

            $expectedReturn = [];

            $this->assertSame($expectedReturn, $actualReturn);

            return;
        }

        foreach($actualReturn as $category){
            $this->assertObjectHasProperty('id', $category);
            $this->assertObjectHasProperty('name', $category);
            $this->assertObjectHasProperty('tax', $category);
            $this->assertObjectHasProperty('active', $category);

            foreach($category as $key => $value){
                $this->assertNotNull($value);
            }
        }
    }

    public function testGETCategoriesPassingArgumentToMethod(){
        $actualReturn = json_decode(CategoryService::getTestInstance()::readCategories(1));

        $this->assertObjectHasProperty('id', $actualReturn);
        $this->assertObjectHasProperty('name', $actualReturn);
        $this->assertObjectHasProperty('tax', $actualReturn);
        $this->assertObjectHasProperty('active', $actualReturn);

        foreach($actualReturn as $key => $value){
            $this->assertNotNull($value);
        }

    }

    public function testPOSTCategoryWithoutPassingData(){

        $this->expectException(CustomException::class);

        CategoryService::getTestInstance()::createCategory();

    }

    public function testPOSTCategoryWithNullValues(){
        $name = '';
        $tax = 0.0;

        $this->assertIsString($name);
        $this->assertIsFloat($tax);

        $this->expectException(CustomException::class);

        $postAttempt = CategoryService::getTestInstance($name, $tax)::createCategory();

    }

    public function testPOSTCategoryWithCorrectValues(){
        $name = 'Created By Test';
        $tax = 4.5;

        $this->assertIsString($name);
        $this->assertIsFloat($tax);

        $postAttempt = CategoryService::getTestInstance($name, $tax)::createCategory();

        $this->assertArrayHasKey('id', $postAttempt);
        $this->assertArrayHasKey('name', $postAttempt);
        $this->assertArrayHasKey('tax', $postAttempt);
        $this->assertArrayHasKey('active', $postAttempt);

        foreach($postAttempt as $value){
            $this->assertNotNull($value);
        }

    }

    public function testDELETECategory(){
//         $this->expectException(CustomException::class);

        $deleteAttempt = CategoryService::getTestInstance()::deleteCategory(1);

        $this->assertArrayHasKey('active', $deleteAttempt);

        $this->assertSame($deleteAttempt['active'], 0);

    }

}
